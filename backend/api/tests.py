from django.test import SimpleTestCase


class ApiTests(SimpleTestCase):
    def test_health(self):
        response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")

    def test_project_catalog(self):
        response = self.client.get("/api/projects/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()["projects"]), 4)

    def test_project_detail_and_missing_project(self):
        response = self.client.get("/api/projects/cricaudit/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["dashboard_view"], "CricAudit")
        self.assertEqual(self.client.get("/api/projects/missing/").status_code, 404)

