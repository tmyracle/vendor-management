class AddVendorsToCompanies < ActiveRecord::Migration[6.0]
  def change
    add_reference :vendors, :company, index: true, foreign_key: true
  end
end
