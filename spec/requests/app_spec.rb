require 'spec_helper'

describe Sinatra::Application do

  def app
    Sinatra::Application
  end

  describe 'GET /' do
    it 'returns success' do
      get '/'

      expect(last_response).to be_ok
    end
  end
end
