class VendorSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :website, :created_at, :updated_at, :company_id, :msa_required, :coi_required, :w9_required, :msa_compliant, :coi_compliant, :w9_compliant, :compliant

  has_many :contacts
  has_many :msas
  has_many :cois
  has_many :w9s

  def msa_compliant
    object.msa_compliant
  end

  def coi_compliant
    object.coi_compliant
  end

  def w9_compliant
    object.w9_compliant
  end

  def compliant
    object.compliant
  end
end
