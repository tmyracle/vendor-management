class LineItemSerializer < ActiveModel::Serializer
  attributes :id, :description, :unit_price, :unit, :identifier, :updated_at
end
