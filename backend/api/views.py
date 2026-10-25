from django.http import JsonResponse

from .catalog import get_project, get_projects


def health(_request):
    return JsonResponse({"status": "ok", "service": "portfolio-api"})


def projects(_request):
    return JsonResponse({"projects": get_projects()})


def project_detail(_request, slug: str):
    project = get_project(slug)
    if project is None:
        return JsonResponse({"detail": "Project not found."}, status=404)
    return JsonResponse(project)

