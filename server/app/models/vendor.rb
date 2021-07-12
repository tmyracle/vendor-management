class Vendor < ApplicationRecord
  has_many :contacts, -> { order('lower(name) asc') }
  belongs_to :company
end
