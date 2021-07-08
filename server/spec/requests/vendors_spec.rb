require 'rails_helper'

describe 'Vendors API', type: :request do
  before(:all) do
    @company = FactoryBot.create(:company, name: "Test Company")
    @user = FactoryBot.create(:user, email: "test@test.com", password: "password123")
    @user.companies << @company
    post '/api/v1/login',  params: {email: "test@test.com", password: "password123"}
    response_json = JSON.parse(response.body)
    @token = response_json["token"]
  end

  context 'when creating new vendors' do
    it 'should not create if unauthorized' do
      post '/api/v1/vendors', params: {name: "New Vendor", website: "www.newvendor.com", description: "newest vendor on the block"}
      expect(response).to have_http_status(:unauthorized)
    end
  
    it 'should create new vendor when authorized' do
      post '/api/v1/vendors', params: {name: "New Vendor", website: "www.newvendor.com", description: "newest vendor on the block"}, headers: {"Authorization": "Bearer #{@token}"}
      expect(response).to have_http_status(:success)
    end
  
    it 'should return vendor after created' do
      post '/api/v1/vendors', params: {name: "New Vendor", website: "www.newvendor.com", description: "newest vendor on the block"}, headers: {"Authorization": "Bearer #{@token}"}
      expect(JSON.parse(response.body)).to have_key("id")
    end
  
  
    it 'should not create vendor with empty name' do
      post '/api/v1/vendors', params: {name: "", website: "www.newvendor.com", description: "newest vendor on the block"}, headers: {"Authorization": "Bearer #{@token}"}
      expect(response).to have_http_status(:internal_server_error)
    end
  end

  context 'when accessing vendors list' do
    it 'should not allow unauthorized request for vendor list' do
      get '/api/v1/vendor_list'
      expect(response).to have_http_status(:unauthorized)
    end
  
    it 'returns successful response from vendors list if authorized' do
      get '/api/v1/vendor_list', headers: {"Authorization": "Bearer #{@token}"}
      expect(response).to have_http_status(:success)
    end
  
    it 'returns the correct number of vendors' do
      v1 = FactoryBot.create(:vendor, name: "Alpha Co", description: "We are alpha!", website: "www.alpha.com", company_id: @company.id)
      v2 = FactoryBot.create(:vendor, name: "Beta Co", description: "We are beta!", website: "www.beta.com", company_id: @company.id)
      v3 = FactoryBot.create(:vendor, name: "Gamma Co", description: "We are gamma!", website: "www.gamma.com", company_id: @company.id)
      get '/api/v1/vendor_list', headers: {"Authorization": "Bearer #{@token}"}
      
      expect(JSON.parse(response.body).size).to eq(3)
    end
  
    it 'should group vendor list by first letter' do
      v1 = FactoryBot.create(:vendor, name: "Alpha Co", description: "We are alpha!", website: "www.alpha.com", company_id: @company.id)
      v2 = FactoryBot.create(:vendor, name: "America Co", description: "We are america!", website: "www.america.com", company_id: @company.id)
      v3 = FactoryBot.create(:vendor, name: "Gamma Co", description: "We are gamma!", website: "www.gamma.com", company_id: @company.id)
      get '/api/v1/vendor_list', headers: {"Authorization": "Bearer #{@token}"}
      
      expect(response).to have_http_status(:success)
      parsed_response = JSON.parse(response.body)
      expect(parsed_response.size).to eq(2)
      expect(parsed_response).to have_key("A")
      expect(parsed_response["A"].size).to eq(2)
    end
  end

  context 'when getting a single vendor' do
    it 'should require authentication' do
      get '/api/v1/vendors/1'
      expect(response).to have_http_status(:unauthorized)
    end

    it 'should return the proper vendor' do
      v1 = FactoryBot.create(:vendor, name: "Alpha Co", description: "We are alpha!", website: "www.alpha.com", company_id: @company.id)
      get "/api/v1/vendors/#{v1.id}", headers: {"Authorization": "Bearer #{@token}"}
      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body)["name"]).to eq("Alpha Co")
    end
  end

  context 'when updating vendor' do
    it 'should require authentication' do
      patch '/api/v1/vendors/1', params: {name: "Updated Name"}
      expect(response).to have_http_status(:unauthorized)
    end

    it 'should return the updated vendor' do
      v1 = FactoryBot.create(:vendor, name: "Alpha Co", description: "We are alpha!", website: "www.alpha.com", company_id: @company.id)
      patch "/api/v1/vendors/#{v1.id}", params: {name: "Updated Name"}, headers: {"Authorization": "Bearer #{@token}"}
      expect(JSON.parse(response.body)["name"]).to eq("Updated Name")
      expect(JSON.parse(response.body)["website"]).to eq("www.alpha.com")
    end
  end
end