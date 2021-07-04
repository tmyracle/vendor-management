require 'rails_helper'

describe 'Users API', type: :request do

  context 'when creating a new user' do
    it 'should create a new user successfully' do
      post '/api/v1/users', params: {full_name: Faker::FunnyName.name, 
                                      email: Faker::Internet.email, 
                                      password: Faker::Internet.password(min_length: 8), 
                                      company_name: Faker::Company.name}

      expect(response).to have_http_status(:success)
    end

    it 'should return the new user with token' do
      post '/api/v1/users', params: {full_name: Faker::FunnyName.name, 
                                      email: Faker::Internet.email, 
                                      password: Faker::Internet.password(min_length: 8), 
                                      company_name: Faker::Company.name}
      expect(JSON.parse(response.body)["token"].size).to be > 8
      expect(JSON.parse(response.body)["token"]).to start_with "ey"
    end

    it 'should create the associated company' do
      post '/api/v1/users', params: {full_name: Faker::FunnyName.name, 
                                      email: Faker::Internet.email, 
                                      password: Faker::Internet.password(min_length: 8), 
                                      company_name: Faker::Company.name}
      expect(JSON.parse(response.body)["user"]["companies"].size).to eq(1)
      expect(JSON.parse(response.body)["user"]["companies"][0]).to have_key("id")
    end
  end

  context 'when logging in a user' do
    before(:all) do
      user = FactoryBot.create(:user, email: "test@test.com", password: "password123")
      company = FactoryBot.create(:company)
      user.companies << company
    end

    it 'should return successful if authenticated' do
      post '/api/v1/login', params: {email: "test@test.com", password: "password123"}
      expect(response).to have_http_status(:success)
    end

    it 'should be unauthorized if authentication fails' do
      post '/api/v1/login', params: {email: "test@test.com", password: "password"}
      expect(response).to have_http_status(:unauthorized)
    end

    it 'should return the user with company and token after login' do
      post '/api/v1/login', params: {email: "test@test.com", password: "password123"}
      expect(JSON.parse(response.body)["token"]).to start_with "ey"
      expect(JSON.parse(response.body)["user"]["companies"].size).to eq(1)
    end
  end

  context 'when checking if logged in' do
    before(:all) do
      user = FactoryBot.create(:user, email: "test@test.com", password: "password123")
      company = FactoryBot.create(:company)
      user.companies << company

      post '/api/v1/login',  params: {email: "test@test.com", password: "password123"}
      response_json = JSON.parse(response.body)
      @token = response_json["token"]
    end

    it 'should be unauthorized if no token' do
      get '/api/v1/auto_login'
      expect(response).to have_http_status(:unauthorized)
    end

    it 'should return success if authorized' do
      get '/api/v1/auto_login', headers: {"Authorization": "Bearer #{@token}"}
      expect(response).to have_http_status(:success)
    end

    it 'should return user if authorized' do
      get '/api/v1/auto_login', headers: {"Authorization": "Bearer #{@token}"}
      expect(JSON.parse(response.body)).to have_key("user")
      expect(JSON.parse(response.body)["user"]).to have_key("id")
    end
  end
end
