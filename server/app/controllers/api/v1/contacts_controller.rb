module Api::V1
  class ContactsController < ApplicationController
    before_action :authorized

    private
      def contact_params
        params.require(:name).permit(:id, :name, :primary_phone, :secondary_phone, :email, :title, :notes, :company_owner)
      end 
  end
end
