FactoryBot.define do
  factory :contact do
    name { Faker::Artist.name }
    title { Faker::Job.title }
    email { Faker::Internet.email }
    primary_phone { Faker::PhoneNumber.cell_phone }
    secondary_phone { Faker::PhoneNumber.cell_phone }
    notes { Faker::Quote.most_interesting_man_in_the_world }
  end
end
