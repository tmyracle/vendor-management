require 'rails_helper'

describe 'Contacts API', type: :request do
  before(:all) do
    @company = FactoryBot.create(:company, name: "Test Company")
    @user = FactoryBot.create(:user, email: "test@test.com", password: "password123")
    @user.companies << @company
    @vendor = FactoryBot.create(:vendor, company_id: @company.id)
    post '/api/v1/login',  params: {email: "test@test.com", password: "password123"}
    response_json = JSON.parse(response.body)
    @token = response_json["token"]
  end

  context 'when creating new contacts' do
    it 'should not create if unauthorized' do
      post '/api/v1/contacts', params: {contact: {name: "Test Contact", email: "testcontact@test.com", primary_phone: "9405555555", vendor_id: @vendor.id}}
      expect(response).to have_http_status(:unauthorized)
    end
  
    it 'should create new contact when authorized' do
      post '/api/v1/contacts', params: {contact: {name: "Test Contact", email: "testcontact@test.com", primary_phone: "9405555555", vendor_id: @vendor.id}}, headers: {"Authorization": "Bearer #{@token}"}
      expect(response).to have_http_status(:success)
    end
  end

  context 'when deleting contacts' do
    it 'should successfully delete contact' do
      c1 = FactoryBot.create(:contact, vendor_id: @vendor.id)
      c2 = FactoryBot.create(:contact, vendor_id: @vendor.id)
      contact_count_initial = Contact.count
      delete "/api/v1/contacts/#{c1.id}", headers: {"Authorization": "Bearer #{@token}"}
      expect(response).to have_http_status(:success)
      contact_count_final = Contact.count
      expect(contact_count_initial - contact_count_final).to eq(1)
    end
  end
end
