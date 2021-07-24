class ContactSerializer < ActiveModel::Serializer
  attributes :id, :vendor_id, :name, :primary_phone, :secondary_phone, :email, :title, :notes, :company_owner, :created_at, :updated_at
end
