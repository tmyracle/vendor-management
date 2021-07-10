class Contact < ApplicationRecord
  belongs_to :vendor

  validates :name, presence: true
end
