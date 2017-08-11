#
class ProjectStory < PivotalTrackerBase
  self.site = 'https://www.pivotaltracker.com/services/v5/projects/:project_id/'
  self.element_name = 'story'
end
