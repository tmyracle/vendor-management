FactoryBot.define do
  factory :user do
    full_name { Faker::Artist.name }
  end
end
