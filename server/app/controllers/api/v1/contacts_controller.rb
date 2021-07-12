module Api::V1
  class ContactsController < ApplicationController
    before_action :authorized

    def create
      contact = Contact.create!(contact_params)
      contact.update(company_owner: @user.companies.first.id)
      if contact.present?
        render json: contact.as_json, status: :ok
      else
        render json: {message: "There was a problem adding the contact."}, status: :internal_server_error
      end
    end

    def update
      contact = Contact.find(params[:id])
      if contact.present?
        contact.update(contact_params)
        render json: contact.as_json, status: :ok
      else
        render json: {message: "There was a problem editing the contact."}, status: :internal_server_error
      end
    end

    def destroy
      contact = Contact.find(params[:id])
      if contact.present?
        contact.destroy
        render status: :ok
      else
        render json: {message: "There was a problem deleting the contact."}, status: :internal_server_error
      end
    end

    private
      def contact_params
        params.require(:contact).permit(:id, :name, :primary_phone, :secondary_phone, :email, :title, :notes, :company_owner, :vendor_id)
      end 
  end
end
