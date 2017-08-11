#
# Class PagesController
#
#
class ReleasesController < ApplicationController
  before_action :set_stories_to_print

  def index
    @releases = Release.where(project_id: params[:project_id])
  end

  def set_stories_to_print
    #TODO: from session cache
    filter_query = 'id:6817691 OR id:6863121'
    @stories_to_print = ProjectStory.find(:all, params: { filter: filter_query, project_id: params[:project_id] })
  end
end
