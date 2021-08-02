class MsaSerializer < ActiveModel::Serializer
  attributes :id, :status, :vendor_id, :executed_on, :uploaded_by, :updated_at, :document_url, :document_name, :uploader, :vendor_name, :type

  def document_url
    object.document_url
  end

  def document_name
    object.document_name
  end

  def uploader
    object.uploader
  end

  def vendor_name
    object.vendor_name
  end

  def type
    object.class.name
  end
end
