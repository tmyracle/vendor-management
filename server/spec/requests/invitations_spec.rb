require 'rails_helper'

describe 'Invitations API', type: :request do
  before(:all) do
    @company = FactoryBot.create(:company, name: "Test Company")
    @user = FactoryBot.create(:user, email: "test@test.com", password: "password123")
    @user.companies << @company
    post '/api/v1/login',  params: {email: "test@test.com", password: "password123"}
    response_json = JSON.parse(response.body)
    @token = response_json["token"]
  end

  context 'create invite' do
    it 'should not allow if unauthenticated' do
      post '/api/v1/invite', params: {full_name: "Invited User", email: "invited@test.com"}
      expect(response).to have_http_status(:unauthorized)  
    end

    it 'should be successful if authenticated' do
      post '/api/v1/invite', params: {full_name: "Invited User", email: "invited@test.com"}, headers: {"Authorization": "Bearer #{@token}"}
      expect(response).to have_http_status(:success)  
    end

    it 'should create new user' do
      post '/api/v1/invite', params: {full_name: "Invited User", email: "invited@test.com"}, headers: {"Authorization": "Bearer #{@token}"}
      expect(JSON.parse(response.body)["invited_user"]["full_name"]).to eq("Invited User")
      expect(JSON.parse(response.body)["invited_user"]).to have_key("id")
    end
    
    it 'should properly associate invite and generate proper token' do
      post '/api/v1/invite', params: {full_name: "Invited User", email: "invited@test.com"}, headers: {"Authorization": "Bearer #{@token}"}
      invited_user = User.find_by(email: "invited@test.com")
      expect(invited_user.invitations.last.invite_token.size).to eq(20)
    end
  end

  context 'accept invite' do
    before(:all) do
      post '/api/v1/invite', params: {full_name: "Invited User", email: "invited@test.com"}, headers: {"Authorization": "Bearer #{@token}"}
      @invite_token = User.find_by(email: "invited@test.com").invitations.last.invite_token
    end

    it 'should fail without token' do
      post '/api/v1/invite/accept', params: {token: "", password: "invitepassword"}
      expect(response).to have_http_status(:internal_server_error)
      expect(JSON.parse(response.body)["error"]).to eq("Token not present")
    end

    it 'should require valid token' do
      invite = Invitation.find_by(invite_token: @invite_token)
      invite.update!(invite_valid_until: 2.month.ago)

      post '/api/v1/invite/accept', params: {token: @invite_token, password: "invitepassword"}
      expect(response).to have_http_status(:not_found)
    end

    it 'should accept invite and set password' do
      post '/api/v1/invite/accept', params: {token: @invite_token, password: "invitepassword"}
      expect(response).to have_http_status(:success)

      post '/api/v1/login',  params: {email: "invited@test.com", password: "invitepassword"}
      expect(response).to have_http_status(:success)
    end
  end
end