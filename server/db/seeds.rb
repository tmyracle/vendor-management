# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

user = User.create(full_name: "Tyler Myracle", email: "tmmyracle@gmail.com", password: "password123")
company = Company.create(name: "Protocol")
company.users << user

vendor = Vendor.create(name: "Mondo Services", description: "The best services at the best price", website: "www.google.com")
company.vendors << vendor