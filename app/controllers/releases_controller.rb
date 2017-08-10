#
# Class PagesController
#
#
class ReleasesController < ApplicationController
  def index
    @releases = Release.where(project_id: params[:project_id])
  end
end
