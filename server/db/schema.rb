# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_08_02_003659) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "cois", force: :cascade do |t|
    t.datetime "policy_effective"
    t.datetime "policy_expires"
    t.bigint "vendor_id", null: false
    t.integer "uploaded_by"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["vendor_id"], name: "index_cois_on_vendor_id"
  end

  create_table "companies", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "companies_users", id: false, force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "company_id", null: false
  end

  create_table "contacts", force: :cascade do |t|
    t.bigint "vendor_id", null: false
    t.string "name"
    t.string "primary_phone"
    t.string "secondary_phone"
    t.string "email"
    t.string "title"
    t.text "notes"
    t.integer "company_owner"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["vendor_id"], name: "index_contacts_on_vendor_id"
  end

  create_table "invitations", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "invited_by"
    t.datetime "invited_at"
    t.datetime "invite_accepted_at"
    t.datetime "invite_valid_until"
    t.string "invite_token"
    t.integer "invite_company"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_invitations_on_user_id"
  end

  create_table "line_items", force: :cascade do |t|
    t.string "description"
    t.decimal "unit_price", precision: 10, scale: 2
    t.string "unit"
    t.bigint "company_id", null: false
    t.string "identifier"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["company_id"], name: "index_line_items_on_company_id"
  end

  create_table "msas", force: :cascade do |t|
    t.bigint "vendor_id", null: false
    t.integer "status"
    t.datetime "executed_on"
    t.integer "uploaded_by"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["vendor_id"], name: "index_msas_on_vendor_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "full_name"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
  end

  create_table "vendors", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "website"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "company_id"
    t.boolean "msa_required", default: true
    t.boolean "coi_required", default: true
    t.boolean "w9_required", default: true
    t.index ["company_id"], name: "index_vendors_on_company_id"
  end

  create_table "w9s", force: :cascade do |t|
    t.bigint "vendor_id", null: false
    t.string "taxpayer_id_number"
    t.datetime "executed_on"
    t.integer "uploaded_by"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["vendor_id"], name: "index_w9s_on_vendor_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "cois", "vendors"
  add_foreign_key "contacts", "vendors"
  add_foreign_key "invitations", "users"
  add_foreign_key "line_items", "companies"
  add_foreign_key "msas", "vendors"
  add_foreign_key "vendors", "companies"
  add_foreign_key "w9s", "vendors"
end
