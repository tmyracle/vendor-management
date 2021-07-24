class CoiSerializer < ActiveModel::Serializer
  attributes :id, :policy_effective, :policy_expires, :vendor_id, :uploaded_by, :updated_at, :document_url, :document_name, :uploader

  def document_url
    object.document_url
  end

  def document_name
    object.document_name
  end

  def uploader
    object.uploader
  end
end