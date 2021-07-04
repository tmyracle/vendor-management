FactoryBot.define do
  factory :vendor do
    name { Faker::Company.name }
    description { Faker::Company.catch_phrase }
    website { Faker::Internet.url }
  end
end
