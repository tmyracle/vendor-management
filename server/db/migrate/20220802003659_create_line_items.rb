class CreateLineItems < ActiveRecord::Migration[6.0]
  def change
    create_table :line_items do |t|
      t.string :description
      t.decimal :unit_price, :precision => 10, :scale => 2
      t.string :unit
      t.references :company, null: false, foreign_key: true
      t.string :identifier

      t.timestamps
    end
  end
end
