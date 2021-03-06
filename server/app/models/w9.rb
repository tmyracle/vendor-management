class W9 < ApplicationRecord
  belongs_to :vendor
  has_one_attached :document

  def document_url
    if document.attached?
      document.blob.service_url
    end
  end

  def document_name
    if document.attached?
      document.blob.filename
    end
  end

  def uploader
    if uploaded_by.present?
      User.find(uploaded_by).full_name
    end
  end

  def vendor_name
    vendor.name
  end
end
