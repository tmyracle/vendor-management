class CreateContacts < ActiveRecord::Migration[6.0]
  def change
    create_table :contacts do |t|
      t.references :vendor, null: false, foreign_key: true
      t.string :name
      t.string :primary_phone
      t.string :secondary_phone
      t.string :email
      t.string :title
      t.text :notes
      t.integer :company_owner

      t.timestamps
    end
  end
end
