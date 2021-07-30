class CompanySerializer < ActiveModel::Serializer
  attributes :id, :name, :logo_url

  def logo_url
    object.logo_url
  end
end
