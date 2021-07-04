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

  it 'should not allow unauthorized request for vendor list' do
    get '/api/v1/vendor_list'
    
    expect(response).to have_http_status(:unauthorized)
  end

  it 'returns the vendor list' do
    v1 = FactoryBot.create(:vendor, name: "Alpha Co", description: "We are alpha!", website: "www.alpha.com", company_id: @company.id)
    v2 = FactoryBot.create(:vendor, name: "Beta Co", description: "We are beta!", website: "www.beta.com", company_id: @company.id)
    v3 = FactoryBot.create(:vendor, name: "Gamma Co", description: "We are gamma!", website: "www.gamma.com", company_id: @company.id)
    get '/api/v1/vendor_list', headers: {"Authorization": "Bearer #{@token}"}
    
    expect(response).to have_http_status(:success)
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