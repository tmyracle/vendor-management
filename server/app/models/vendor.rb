class Vendor < ApplicationRecord
  has_many :contacts, -> { order('lower(name) asc') }, dependent: :delete_all
  has_many :msas, dependent: :delete_all
  has_many :cois, dependent: :delete_all
  has_many :w9s, dependent: :delete_all
  belongs_to :company
end
