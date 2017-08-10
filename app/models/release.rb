#
class Release < PivotalTrackerBase
  self.site = 'https://www.pivotaltracker.com/services/v5/projects/:project_id/'
  has_many :stories
end
