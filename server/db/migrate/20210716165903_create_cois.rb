class CreateCois < ActiveRecord::Migration[6.0]
  def change
    create_table :cois do |t|
      t.datetime :policy_effective
      t.datetime :policy_expires
      t.references :vendor, null: false, foreign_key: true
      t.integer :uploaded_by

      t.timestamps
    end
  end
end
