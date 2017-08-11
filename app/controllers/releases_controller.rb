#
# Class PagesController
#
#
class ReleasesController < ApplicationController
  before_action :set_stories_to_print

  def index
    @releases = Release.where(project_id: params[:project_id])
  end
end
