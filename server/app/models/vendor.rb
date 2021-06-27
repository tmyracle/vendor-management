class Vendor < ApplicationRecord
  has_many :contacts
  belongs_to :company
end
