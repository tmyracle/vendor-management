require 'rails_helper'

describe 'Companies API', type: :request do
  before(:all) do
    @company = FactoryBot.create(:company, name: "Test Company")
    @user = FactoryBot.create(:user, email: "test@test.com", password: "password123")
    @user.companies << @company
    post '/api/v1/login',  params: {email: "test@test.com", password: "password123"}
    response_json = JSON.parse(response.body)
    @token = response_json["token"]
  end

  context 'show company' do
    it 'should fail if unauthorized' do
      get "/api/v1/companies/#{@company.id}"
      expect(response).to have_http_status(:unauthorized)
    end

    it 'should retern the correct company' do
      get "/api/v1/companies/#{@company.id}", headers: {"Authorization": "Bearer #{@token}"}
      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body)["company"]["name"]).to eq("Test Company")
    end
  end
end