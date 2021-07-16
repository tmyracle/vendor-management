class CreateW9s < ActiveRecord::Migration[6.0]
  def change
    create_table :w9s do |t|
      t.references :vendor, null: false, foreign_key: true
      t.string :taxpayer_id_number
      t.datetime :executed_on
      t.integer :uploaded_by

      t.timestamps
    end
  end
end
