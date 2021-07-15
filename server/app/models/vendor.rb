class Vendor < ApplicationRecord
  has_many :contacts, -> { order('lower(name) asc') }, dependent: :delete_all
  has_many :msas, dependent: :delete_all
  belongs_to :company
end
