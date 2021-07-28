module Api::V1 
  class DashboardController < ApplicationController
    before_action :authorized

    def show
      vendors = @user.companies.first.vendors

      vendor_count = vendors.count
      compliant_vendor_count = 0
      vendor_requires_msa_count = 0
      msa_compliant_count = 0
      vendor_requires_coi_count = 0
      coi_compliant_count = 0
      vendor_requires_w9_count = 0
      w9_compliant_count = 0

      vendors.each do |vendor|
        vendor.compliant ? compliant_vendor_count += 1 : nil
        vendor.msa_required ? vendor_requires_msa_count += 1 : nil
        vendor.msa_compliant ? msa_compliant_count += 1 : nil
        vendor.coi_required ? vendor_requires_coi_count += 1 : nil
        vendor.coi_compliant ? coi_compliant_count += 1 : nil
        vendor.w9_required ? vendor_requires_w9_count += 1 : nil
        vendor.w9_compliant ? w9_compliant_count += 1 : nil
      end

      render json: {vendor_count: vendor_count, 
                    compliant: compliant_vendor_count,
                    msa_required: vendor_requires_msa_count, 
                    msa_compliant: msa_compliant_count,
                    coi_required: vendor_requires_coi_count, 
                    coi_compliant: coi_compliant_count,
                    w9_required: vendor_requires_w9_count,
                    w9_compliant: w9_compliant_count,
                    user_name: @user.full_name,
                    company_name: @user.companies.first.name,
                    company_logo: @user.companies.first.logo_url
                  }
    end
  end
end
