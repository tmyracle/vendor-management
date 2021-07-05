require 'rails_helper'

describe 'Passwords API', type: :request do
  before(:all) do
    user = FactoryBot.create(:user, email: "test@test.com", password: "password123")
    company = FactoryBot.create(:company)
    user.companies << company
  end

  context 'forgot password' do
    it 'should require an email param' do
      post '/api/v1/password/forgot', params: {email: ""}
      expect(response).to have_http_status(:internal_server_error)
    end

    it 'returns not found if user does not exist' do
      post '/api/v1/password/forgot', params: {email: "warblegarble@bruh.com"}
      expect(response).to have_http_status(:not_found)
    end

    it 'is successful if user is found' do
      post '/api/v1/password/forgot', params: {email: "test@test.com"}
      expect(response).to have_http_status(:success)
    end
  end

  context 'reset password' do
    before(:all) do
      post '/api/v1/password/forgot', params: {email: "test@test.com"}
      @user = User.find_by(email: "test@test.com")
      @reset_token = @user.reset_password_token
    end

    it 'should fail if no token provided' do
      post '/api/v1/password/reset', params: {token: "", password: "newpassword"}
      expect(response).to have_http_status(:internal_server_error)
    end

    it 'should fail if token is not valid' do
      post '/api/v1/password/reset', params: {token: "12345678", password: "newpassword"}
      expect(response).to have_http_status(:not_found)
    end

    it 'should be successful if valid token provided' do
      post '/api/v1/password/reset', params: {token: @reset_token, password: "newpassword"}
      expect(response).to have_http_status(:success)
    end

    it 'should be able to login with new password' do
      post '/api/v1/login', params: {email: "test@test.com", password: "newpassword"}
      expect(response).to have_http_status(:unauthorized)
      
      post '/api/v1/password/reset', params: {token: @reset_token, password: "newpassword"}
      post '/api/v1/login', params: {email: "test@test.com", password: "newpassword"}
      expect(response).to have_http_status(:success)
    end

  end
end