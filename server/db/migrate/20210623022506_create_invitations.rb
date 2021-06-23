class CreateInvitations < ActiveRecord::Migration[6.0]
  def change
    create_table :invitations do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :invited_by
      t.datetime :invited_at
      t.datetime :invite_accepted_at
      t.datetime :invite_valid_until
      t.string :invite_token
      t.integer :invite_company

      t.timestamps
    end
  end
end
