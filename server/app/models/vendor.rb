class Vendor < ApplicationRecord
  has_many :contacts, -> { order('lower(name) asc') }, dependent: :delete_all
  has_many :msas, dependent: :delete_all
  has_many :cois, dependent: :delete_all
  has_many :w9s, dependent: :delete_all
  belongs_to :company

  def msa_compliant
    if msa_required
      msas[0].present? and msas[0].status == 'executed' and msas[0].document.attached?
    else
      true
    end
  end

  def coi_compliant
    if coi_required
      cois[0].present? and cois[0].policy_effective <= Date.today and cois[0].policy_expires >= Date.today and cois[0].document.attached?
    else
      true
    end
  end

  def w9_compliant
    if w9_required
      w9s[0].present? and w9s[0].taxpayer_id_number.present? and w9s[0].document.attached?
    else
      true
    end
  end

  def compliant
    msa_compliant and coi_compliant and w9_compliant
  end
end
