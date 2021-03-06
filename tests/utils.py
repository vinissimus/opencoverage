import os

from opencoverage.parser import parse_raw_coverage_data

_data_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "data")


def read_data(name):
    with open(os.path.join(_data_dir, name), "rb") as fi:
        return fi.read()


async def add_coverage(db, organization, repo, branch, commit, coverage):
    coverage = parse_raw_coverage_data(read_data(coverage))
    await db.save_coverage(
        organization=organization,
        repo=repo,
        branch=branch,
        commit_hash=commit,
        coverage=coverage,
    )
