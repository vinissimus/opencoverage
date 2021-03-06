import useSWR from 'swr'
import Link from 'next/link'
import Header from '../../../../../../components/header'
import Footer from '../../../../../../components/footer'
import ReportLink from '../../../../../../components/reportlink'
import {
  fetcher,
  apiUrl,
  calcTagClassName,
  rawFetcher,
  fmtNumber
} from '../../../../../../utils'
import { useRouter } from 'next/router'

function FileLine ({ line, lineno, report, fileCoverage }) {
  lineno = lineno + 1
  var className = 'line'

  if (line) {
    if (fileCoverage.lines[lineno] !== undefined) {
      if (fileCoverage.lines[lineno] == 1) {
        // covered
        className += ' covered'
      } else {
        className += ' not-covered'
      }
    }
  }
  return (
    <div className={className}>
      <div className='line-number'>{lineno}</div>
      <div className='line-source'>{line.split(' ').join('\u00a0')}</div>
    </div>
  )
}

function File ({ report, filename, fileCoverage }) {
  const resp = useSWR(
    `${apiUrl}/${report.organization}/repos/${report.repo}/commits/${report.commit_hash}/download?filename=${filename}`,
    rawFetcher
  )
  if (!resp.data) {
    return <p>Could not find file</p>
  }
  const lines = resp.data.split(/\r?\n/)
  return (
    <section className='source'>
      {lines.map((line, lineno) => {
        return (
          <FileLine
            key={lineno}
            line={line}
            lineno={lineno}
            report={report}
            fileCoverage={fileCoverage}
          />
        )
      })}
    </section>
  )
}

function FileCoverage ({ report, filename }) {
  const { data } = useSWR(
    `${apiUrl}/${report.organization}/repos/${report.repo}/commits/${report.commit_hash}/file?filename=${filename}`,
    fetcher
  )
  if (data && data.reason && data.reason == 'fileNotFound') {
    return <p>Not found</p>
  }
  if (!data) {
    return <div />
  }

  return (
    <div>
      <ReportLink report={report} />
      <h2 className='subtitle'>
        Filename:{' '}
        <a
          href={
            'https://github.com/' +
            report.organization +
            '/' +
            report.repo +
            '/blob/' +
            report.commit_hash +
            '/' +
            filename
          }
        >
          {filename}
        </a>
      </h2>
      <p>
        Overall file coverage:
        <span className={'tag is-light ' + calcTagClassName(data.line_rate)}>
          {(data.line_rate * 100).toFixed(1)}%
        </span>
        - Covered lines:
        <span className='tag is-primary is-light'>
          {fmtNumber(report.lines_covered)}
        </span>
        - Total lines:
        <span className='tag is-primary is-light'>
          {fmtNumber(report.lines_valid)}
        </span>
      </p>

      <File report={report} filename={filename} fileCoverage={data} />
    </div>
  )
}

function FilePage ({ params }) {
  const router = useRouter()
  const { filename } = router.query

  const { data, error } = useSWR(
    `${apiUrl}/${params.org}/repos/${params.repo}/commits/${params.commit}/report`,
    fetcher
  )
  if (!data) {
    return <div />
  }

  return (
    <div className='container'>
      <Header />

      <FileCoverage report={data} filename={filename} />

      <Footer />
    </div>
  )
}

// This also gets called at build time
export async function getServerSideProps ({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  //   const res = await fetch(`https://.../posts/${params.id}`)
  //   const post = await res.json()

  // Pass post data to the page via props
  return {
    props: {
      params
    }
  }
}

export default FilePage
