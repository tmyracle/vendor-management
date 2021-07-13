require 'rails_helper'

describe Contact, type: :model do
  before(:all) do
    @company = FactoryBot.create(:company, name: "Test Company")
    @user = FactoryBot.create(:user, email: "test@test.com", password: "password123")
    @user.companies << @company
    @vendor = FactoryBot.create(:vendor, company_id: @company.id)
  end

  it 'should not be valid without name' do
    contact = Contact.new(vendor_id: @vendor.id)
    expect(contact).to_not be_valid
  end

  it 'should require name to be valid' do
    contact = Contact.new(name: "Test Contact", vendor_id: @vendor.id)
    expect(contact).to be_valid
  end
end
