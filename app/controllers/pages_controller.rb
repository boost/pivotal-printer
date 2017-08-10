#
# Class PagesController
#
#
class PagesController < ApplicationController
  def home
    @projects = Project.all
  end
end
