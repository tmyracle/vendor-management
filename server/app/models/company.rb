class Company < ApplicationRecord
  has_and_belongs_to_many :users
  has_one_attached :logo
  has_many :vendors
  has_many :msas, through: :vendors
  has_many :cois, through: :vendors
  has_many :w9s, through: :vendors

  def logo_url
    if logo.attached?
      logo.blob.service_url
    end
  end
end