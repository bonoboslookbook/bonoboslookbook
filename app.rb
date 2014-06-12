require 'coffee-script'
require 'haml'
require 'sinatra'
require 'barista'

set :haml, format: :html5


root = File.dirname(__FILE__)

Barista.app_root = root
Barista.root     = File.join(root, 'public/coffeescripts')
Barista.setup_defaults
barista_config = root + '/barista_config.rb'
require barista_config if File.exist?(barista_config)
register Barista::Integration::Sinatra

get '/' do
  haml :index
end
