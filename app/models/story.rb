#
class Story < PivotalTrackerBase
  self.site = 'https://www.pivotaltracker.com/services/v5/projects/:project_id/releases/:release_id/'
end
