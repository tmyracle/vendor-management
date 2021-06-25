class Company < ApplicationRecord
  has_and_belongs_to_many :users
  has_one_attached :logo

  def logo_url
    if logo.attached?
      logo.blob.service_url
    end
  end
end