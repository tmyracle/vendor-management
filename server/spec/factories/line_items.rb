FactoryBot.define do
  factory :line_item do
    description { "MyString" }
    unit_price { "9.99" }
    unit { "MyString" }
    references { "" }
    identifier { "MyString" }
  end
end
