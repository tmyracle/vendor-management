class AddFieldsToVendor < ActiveRecord::Migration[6.0]
  def change
    add_column :vendors, :msa_required, :boolean, default: true
    add_column :vendors, :coi_required, :boolean, default: true
    add_column :vendors, :w9_required, :boolean, default: true
  end
end
