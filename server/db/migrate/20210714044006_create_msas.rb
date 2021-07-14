class CreateMsas < ActiveRecord::Migration[6.0]
  def change
    create_table :msas do |t|
      t.references :vendor, null: false, foreign_key: true
      t.integer :status
      t.datetime :executed_on
      t.integer :uploaded_by

      t.timestamps
    end
  end
end
