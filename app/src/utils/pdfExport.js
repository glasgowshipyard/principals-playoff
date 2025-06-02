import jsPDF from 'jspdf';

/**
 * Generate PDF report with branding and complete analysis
 */
export const generatePDFReport = async (results, configuration) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  let yPosition = margin;

  // Helper functions
  const addPageBreakIfNeeded = (requiredSpace) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  const addText = (text, size = 12, style = 'normal', color = '#000000') => {
    pdf.setFontSize(size);
    pdf.setFont('helvetica', style);
    pdf.setTextColor(color);
    
    const lines = pdf.splitTextToSize(text, contentWidth);
    const lineHeight = size * 0.35;
    
    addPageBreakIfNeeded(lines.length * lineHeight + 5);
    
    pdf.text(lines, margin, yPosition);
    yPosition += lines.length * lineHeight + 5;
  };

  const addHeading = (text, level = 1) => {
    const sizes = { 1: 20, 2: 16, 3: 14 };
    const spacing = { 1: 10, 2: 8, 3: 6 };
    
    yPosition += spacing[level];
    addText(text, sizes[level], 'bold', configuration.branding.primaryColor || '#2563eb');
    yPosition += 5;
  };

  const addSeparator = () => {
    addPageBreakIfNeeded(10);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
  };

  // Header with branding
  if (configuration.branding.logoUrl) {
    try {
      // Add logo if available
      const logoSize = 15;
      pdf.addImage(configuration.branding.logoUrl, 'JPEG', margin, yPosition, logoSize, logoSize);
      
      if (configuration.branding.orgName) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(configuration.branding.primaryColor || '#2563eb');
        pdf.text(configuration.branding.orgName, margin + logoSize + 5, yPosition + 8);
      }
      yPosition += logoSize + 10;
    } catch (error) {
      console.warn('Could not add logo to PDF:', error);
    }
  } else if (configuration.branding.orgName) {
    addText(configuration.branding.orgName, 16, 'bold', configuration.branding.primaryColor || '#2563eb');
  }

  // Title
  addHeading('Principals Playoff Results', 1);
  
  // Completion info
  const completionDate = new Date(results.metadata.timestamp).toLocaleDateString();
  const completionTime = results.metadata.completionTime 
    ? `${Math.floor(results.metadata.completionTime / 60000)}:${Math.floor((results.metadata.completionTime % 60000) / 1000).toString().padStart(2, '0')}`
    : 'N/A';
  
  addText(`Completed: ${completionDate} | Duration: ${completionTime}`, 10, 'normal', '#666666');
  addSeparator();

  // Executive Summary
  addHeading('Executive Summary', 2);
  addText(`Decision-Making Style: ${results.profile.style}`);
  addText(`Primary Drive: ${results.profile.primaryCategory}`);
  addText(`Champion Principle: ${results.personalHierarchy[0]?.title || 'N/A'}`);
  
  if (results.organizationalAlignment) {
    addText(`Organizational Alignment: ${results.organizationalAlignment.alignmentScore}% match`);
  }
  
  addSeparator();

  // Principle Hierarchy
  addHeading('Your Principle Hierarchy', 2);
  addText('This ranking reveals what truly drives your decisions when forced to choose between competing values.');
  
  yPosition += 5;
  
  results.personalHierarchy.forEach((principle, index) => {
    const rank = index + 1;
    const rankSuffix = rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th';
    
    addPageBreakIfNeeded(25);
    
    // Rank badge
    pdf.setFillColor(rank <= 3 ? 5 : rank <= 8 ? 37 : 107, rank <= 3 ? 150 : rank <= 8 ? 99 : 114, rank <= 3 ? 105 : rank <= 8 ? 235 : 128);
    pdf.rect(margin, yPosition, 15, 8, 'F');
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor('#ffffff');
    pdf.text(`${rank}${rankSuffix}`, margin + 2, yPosition + 5);
    
    // Principle info
    pdf.setTextColor('#000000');
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(principle.title, margin + 20, yPosition + 5);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor('#666666');
    const descLines = pdf.splitTextToSize(principle.description, contentWidth - 25);
    pdf.text(descLines, margin + 20, yPosition + 10);
    
    pdf.setTextColor('#999999');
    pdf.text(principle.category, margin + 20, yPosition + 10 + (descLines.length * 3.5) + 3);
    
    yPosition += 20 + (descLines.length * 3.5);
  });

  addSeparator();

  // Personal Profile Analysis
  addHeading('Decision-Making Profile Analysis', 2);
  
  addHeading('Your Strengths', 3);
  results.profile.strengths.forEach(strength => {
    addText(`• ${strength}`, 10);
  });

  if (results.profile.tensions.length > 0) {
    addHeading('Potential Tensions', 3);
    results.profile.tensions.forEach(tension => {
      addText(`• ${tension}`, 10);
    });
  }

  addHeading('Recommendations', 3);
  results.profile.recommendations.forEach(rec => {
    addText(`• ${rec}`, 10);
  });

  // Organizational Alignment (if available)
  if (results.organizationalAlignment) {
    addSeparator();
    addHeading('Organizational Alignment Analysis', 2);
    
    const score = results.organizationalAlignment.alignmentScore;
    const interpretation = score >= 70 ? 'Strong alignment - your values naturally fit' :
                          score >= 40 ? 'Moderate alignment - some areas to explore' :
                          'Lower alignment - opportunities for discussion';
    
    addText(`Alignment Score: ${score}% - ${interpretation}`, 12, 'bold');

    if (results.organizationalAlignment.matches.length > 0) {
      addHeading('Strong Matches', 3);
      results.organizationalAlignment.matches.forEach(match => {
        addText(`✓ ${match}`, 10);
      });
    }

    if (results.organizationalAlignment.conflicts.length > 0) {
      addHeading('Areas to Explore', 3);
      results.organizationalAlignment.conflicts.forEach(conflict => {
        addText(`• ${conflict}`, 10);
      });
    }

    addHeading('Navigation Strategies', 3);
    results.organizationalAlignment.strategies.forEach(strategy => {
      addText(`• ${strategy}`, 10);
    });

    addHeading('Discussion Starters', 3);
    results.organizationalAlignment.discussionPoints.forEach(point => {
      addText(`• ${point}`, 10);
    });
  }

  addSeparator();

  // Understanding Your Results
  addHeading('Understanding Your Results', 2);
  
  addText('What this means:', 12, 'bold');
  addText('Your #1 principle is what you truly prioritize when forced to choose. The ranking reveals your authentic decision-making hierarchy, not what you think should matter.');
  
  addText('How to use this:', 12, 'bold');
  addText('Use these insights for career decisions, relationship choices, and understanding potential conflicts between your values and your environment.');
  
  addText('Remember:', 12, 'bold');
  addText('There are no "right" or "wrong" principles. This is about understanding your authentic drivers, not judging them.');

  addSeparator();

  // Evolution note
  addHeading('Your Principles Evolve', 2);
  addText('Your guiding principles aren\'t fixed. They shift with life experiences, new responsibilities, and personal growth. Consider retaking this assessment:');
  addText('• Annually for ongoing self-awareness');
  addText('• When changing roles or careers');  
  addText('• After major life events (marriage, parenthood, health changes)');
  addText('• When feeling misaligned or stuck in decisions');

  // Footer
  addPageBreakIfNeeded(20);
  yPosition = pageHeight - 15;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor('#999999');
  pdf.text('Generated with Principals Playoff | claude.ai/code', margin, yPosition);
  pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth - margin - 40, yPosition);

  return pdf;
};

export const downloadPDF = async (results, configuration) => {
  try {
    const pdf = await generatePDFReport(results, configuration);
    const fileName = `principals-playoff-results-${new Date().getTime()}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};