FactoryBot.define do
  factory :coi do
    policy_effective { "2021-07-16 09:59:03" }
    policy_expires { "2021-07-16 09:59:03" }
    vendor { nil }
    uploaded_by { 1 }
  end
end
